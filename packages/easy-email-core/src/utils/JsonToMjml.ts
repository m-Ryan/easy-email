import { parseReactBlockToBlockData } from '@core/utils/parseReactBlockToBlockData';
import { isValidElement } from 'react';

import { BasicType } from '@core/constants';
import { IBlockData } from '@core/typings';
import { pickBy, identity, isObject, isBoolean, isString } from 'lodash';
import {
  getChildIdx,
  getNodeIdxClassName,
  getNodeTypeClassName,
} from './block';
import { classnames } from './classnames';
import { BlockManager } from '@core/utils';
import { ICarousel, INavbar, ISocial, IPage } from '@core/blocks';
import { getPreviewClassName } from './getPreviewClassName';
import { getImg } from './getImg';

export type JsonToMjmlOption =
  | {
    data: IBlockData;
    idx: string | null; // current idx
    context?: IBlockData;
    dataSource?: { [key: string]: any; };
    mode: 'testing';
  }
  | {
    idx?: string | null; // current idx, default page idx
    data: IBlockData;
    context?: IBlockData;
    mode: 'production';
    dataSource?: { [key: string]: any; };
  };

export function JsonToMjml(options: JsonToMjmlOption): string {
  const {
    data,
    idx = 'content',
    context = data,
    mode = 'production',
    dataSource = {},
  } = options;
  if (
    (isBoolean(data?.data?.hidden) && data?.data?.hidden) ||
    data?.data?.hidden === 'true'
  ) {
    return '';
  }

  const att = pickBy(
    {
      ...data.attributes,
    },
    identity
  );

  const isTest = mode === 'testing';
  const placeholder = isTest && idx ? renderPlaceholder(data.type) : '';

  if (isTest && idx) {
    att['css-class'] = classnames(
      att['css-class'],
      'email-block',
      getNodeIdxClassName(idx),
      getNodeTypeClassName(data.type)
    );
  }

  if (data.type === BasicType.PAGE) {
    att['css-class'] = classnames(att['css-class'], 'mjml-body');
  }

  const attributeStr = Object.keys(att)
    .filter((key) => att[key] !== '') // filter att=""
    .map((key) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const val = isString(att[key]) ? att[key].replace(/"/gm, '') : att[key];
      return `${key}="${val}"`;
    })
    .join(' ');

  const block = BlockManager.getBlockByType(data.type);

  if (!block) {
    throw new Error(
      `Can not find ${data.type} block!!! Have you registered this block ?`
    );
  }

  if (block.render) {
    const transformBlockData = block.render(
      data,
      idx,
      mode,
      context,
      dataSource
    );
    if (!transformBlockData) return '';
    const transformData = isValidElement(transformBlockData)
      ? parseReactBlockToBlockData(transformBlockData)
      : transformBlockData;
    att['css-class'] = classnames(
      isTest && getPreviewClassName(idx, data.type),
      transformData?.['attributes']?.['css-class']
    );
    return JsonToMjml({
      data: {
        ...transformData,
        attributes: {
          ...transformData.attributes,
          'css-class': att['css-class'],
        },
      },
      idx: null,
      context: data,
      dataSource,
      mode,
    });
  }

  const children = data.children
    .map((child, index) => {
      let childIdx = idx ? getChildIdx(idx, index) : null;
      if (data.type === BasicType.TEMPLATE) {
        childIdx = getChildIdx(data.data.value.idx, index);
        if (!data.data.value.idx) {
          childIdx = null;
        }
      }
      return JsonToMjml({
        data: child,
        idx: childIdx,
        dataSource,
        context,
        mode,
      });
    })
    .join('\n');

  switch (data.type) {
    case BasicType.TEMPLATE:
      return children || data.data.value.content;
    case BasicType.PAGE:
      const metaData = generaMjmlMetaData(data);
      const value: IPage['data']['value'] = data.data.value;

      const breakpoint = value.breakpoint
        ? `<mj-breakpoint width="${data.data.value.breakpoint}" />`
        : '';

      const nonResponsive = !value.responsive
        ? `<mj-raw>
            <meta name="viewport" />
           </mj-raw>
           <mj-style inline="inline">.mjml-body { width: ${data.attributes.width || '600px'
        }; margin: 0px auto; }</mj-style>`
        : '';
      const styles =
        value.headStyles
          ?.map(
            (style) =>
              `<mj-style ${style.inline ? 'inline="inline"' : ''}>${style.content
              }</mj-style>`
          )
          .join('\n') || '';

      const userStyle = value['user-style']
        ? `<mj-style ${value['user-style'].inline ? 'inline="inline"' : ''}>${value['user-style'].content
        }</mj-style>`
        : '';

      return `
        <mjml>
          <mj-head>
              ${metaData}
              ${nonResponsive}
              ${styles}
              ${userStyle}
              ${breakpoint}
              ${value.fonts
          ?.filter(Boolean)
          .map(
            (item) =>
              `<mj-font name="${item.name}" href="${item.href}" />`
          )}
            <mj-attributes>
              ${value.headAttributes}
              ${value['font-family']
          ? `<mj-all font-family="${value['font-family']}" />`
          : ''
        }
              ${value['font-size']
          ? `<mj-text font-size="${value['font-size']}" />`
          : ''
        }
              ${value['text-color']
          ? `<mj-text color="${value['text-color']}" />`
          : ''
        }
              ${value['line-height']
          ? `<mj-text line-height="${value['line-height']}" />`
          : ''
        }
              ${value['content-background-color']
          ? `<mj-wrapper background-color="${value['content-background-color']}" />
                     <mj-section background-color="${value['content-background-color']}" />
                    `
          : ''
        }
            </mj-attributes>
          </mj-head>
          <mj-body ${attributeStr}>
            ${children}
          </mj-body>
        </mjml>
        `;
    case BasicType.COLUMN:
      return `
              <mj-column ${attributeStr}>
               ${children || placeholder}
              </mj-column>
            `;
    case BasicType.SECTION:
      return `
              <mj-section ${attributeStr}>
               ${children || `<mj-column>${placeholder}</mj-column>`}
              </mj-section>
            `;
    case BasicType.GROUP:
      return `
              <mj-group ${attributeStr}>
               ${children || `<mj-column>${placeholder}</mj-column>`}
              </mj-group>
            `;
    case BasicType.WRAPPER:
      return `
              <mj-wrapper ${attributeStr}>
               ${children ||
        `<mj-section><mj-column>${placeholder}</mj-column></mj-section>`
        }
              </mj-wrapper>
            `;
    case BasicType.CAROUSEL:
      const carouselImages = (data as ICarousel).data.value.images
        .map((image, index) => {
          const imageAttributeStr = Object.keys(image)
            .filter((key) => key !== 'content' && att[key] !== '') // filter att=""
            .map((key) => `${key}="${image[key as keyof typeof image]}"`)
            .join(' ');
          return `
          <mj-carousel-image ${imageAttributeStr} />
          `;
        })
        .join('\n');

      return `
        <mj-carousel ${attributeStr}>
         ${carouselImages}
        </mj-carousel>
      `;
    case BasicType.NAVBAR:
      const links = (data as INavbar).data.value.links
        .map((link, index) => {
          const linkAttributeStr = Object.keys(link)
            .filter((key) => key !== 'content' && att[key] !== '') // filter att=""
            .map((key) => `${key}="${link[key as keyof typeof link]}"`)
            .join(' ');
          return `
          <mj-navbar-link ${linkAttributeStr}>${link.content}</mj-navbar-link>
          `;
        })
        .join('\n');
      return `
              <mj-navbar ${attributeStr}>
               ${links}
              </mj-navbar>
            `;
    case BasicType.SOCIAL:
      const elements = (data as ISocial).data.value.elements
        .map((element, index) => {
          const elementAttributeStr = Object.keys(element)
            .filter((key) => key !== 'content' && att[key] !== '') // filter att=""
            .map((key) => `${key}="${element[key as keyof typeof element]}"`)
            .join(' ');
          return `
          <mj-social-element ${elementAttributeStr}>${element.content}</mj-social-element>
          `;
        })
        .join('\n');
      return `
              <mj-social ${attributeStr}>
               ${elements}
              </mj-social>
            `;
    case BasicType.RAW:
      return `
              <mj-raw ${attributeStr}>
                ${data.data.value?.content}
              </mj-raw>
            `;
    case BasicType.IMAGE:
      if (mode === 'testing') {
        const url = data.attributes.src;
        if (
          url === '' ||
          /{{([\s\S]+?)}}/g.test(url) ||
          /\*\|([^\|\*]+)\|\*/g.test(url)
        ) {
          return `<mj-image src="${getImg(
            'IMAGE_59'
          )}"  ${attributeStr}></mj-image>`;
        }
      }
      return `<mj-image ${attributeStr}></mj-image>`;
    default:
      return `
          <mj-${data.type} ${attributeStr}>
           ${children || data.data.value?.content || ''}
          </mj-${data.type}>
        `;
  }
}

export function renderPlaceholder(type: string) {
  let text = '';
  if (type === BasicType.PAGE) {
    text = 'Drop a Wrapper block here';
  } else if (type === BasicType.WRAPPER) {
    text = 'Drop a Section block here';
  } else if (type === BasicType.SECTION || type === BasicType.GROUP) {
    text = 'Drop a Column block here';
  } else if (type === BasicType.COLUMN) {
    text = 'Drop a content block here';
  }

  return `
   <mj-text color="#666">
    <div style="text-align: center">
      <div>
        <svg width="300" fill="currentColor" style="max-width: 100%;" viewBox="-20 -5 80 60">
          <g>
            <path d="M23.713 23.475h5.907c.21 0 .38.17.38.38v.073c0 .21-.17.38-.38.38h-5.907a.38.38 0 0 1-.38-.38v-.073c0-.21.17-.38.38-.38zm.037-2.917h9.167a.417.417 0 0 1 0 .834H23.75a.417.417 0 0 1 0-.834zm0-2.5h9.167a.417.417 0 0 1 0 .834H23.75a.417.417 0 0 1 0-.834zm-.037-3.333h5.907c.21 0 .38.17.38.38v.073c0 .21-.17.38-.38.38h-5.907a.38.38 0 0 1-.38-.38v-.073c0-.21.17-.38.38-.38zm.037-2.917h9.167a.417.417 0 0 1 0 .834H23.75a.417.417 0 0 1 0-.834zm0-2.916h9.167a.417.417 0 0 1 0 .833H23.75a.417.417 0 0 1 0-.833zm-3.592 8.75a.675.675 0 0 1 .675.691v6.142c0 .374-.3.679-.675.683h-6.15a.683.683 0 0 1-.675-.683v-6.142a.675.675 0 0 1 .675-.691h6.15zM20 24.308v-5.833h-5.833v5.833H20zm.158-15.833a.675.675 0 0 1 .675.692v6.141c0 .374-.3.68-.675.684h-6.15a.683.683 0 0 1-.675-.684V9.167a.675.675 0 0 1 .675-.692h6.15zM20 15.142V9.308h-5.833v5.834H20zM37.167 0A2.809 2.809 0 0 1 40 2.833V30.5a2.809 2.809 0 0 1-2.833 2.833h-3.834v3H32.5v-3h-23A2.808 2.808 0 0 1 6.667 30.5v-23H3.583v-.833h3.084V2.833A2.808 2.808 0 0 1 9.5 0h27.667zm2 30.5V2.833a2.025 2.025 0 0 0-2-2H9.5a2.025 2.025 0 0 0-2 2V30.5a2.025 2.025 0 0 0 2 2h27.667a2.025 2.025 0 0 0 2-2zM0 27.75h.833V31H0v-3.25zm0-13h.833V18H0v-3.25zm0 22.833V34.25h.833v3.25L0 37.583zM0 21.25h.833v3.25H0v-3.25zM2.583 40l.084-.833h3.166V40h-3.25zm27.917-.833c.376.006.748-.08 1.083-.25l.417.666a2.875 2.875 0 0 1-1.5.417h-1.833v-.833H30.5zm-8.333 0h3.25V40h-3.25v-.833zm-6.584 0h3.25V40h-3.25v-.833zm-6.5 0h3.25V40h-3.25v-.833zM0 9.5c.01-.5.154-.99.417-1.417l.666.417c-.17.305-.256.65-.25 1v2H0v-2z"></path>
          </g>
          <text x="-16" y="50" font-size="5px">${text}</text>
        </svg>
      </div>
    </div>
   </mj-text>
  `;
}

export function generaMjmlMetaData(data: IPage) {
  const values = data.data.value;
  const attributes = [
    'content-background-color',
    'text-color',
    'font-family',
    'font-size',
    'line-height',
    'user-style',
    'responsive',
  ];
  return `
    <mj-html-attributes>
      ${attributes
      .filter((key) => values[key as keyof typeof values] !== undefined)
      .map((key) => {
        const attKey = key as keyof typeof values;
        const isMultipleAttributes = isObject(values[attKey]);
        const value = isMultipleAttributes
          ? Object.keys(values[attKey]!)
            .map(
              (childKey) =>
                `${childKey}="${(values[attKey] as any)[childKey]}"`
            )
            .join(' ')
          : `${key}="${values[attKey]}"`;
        return `<mj-html-attribute class="easy-email" multiple-attributes="${isMultipleAttributes}" attribute-name="${key}" ${value}></mj-html-attribute>`;
      })
      .join('\n')}

    </mj-html-attributes>
  `;
}
