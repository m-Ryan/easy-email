/* eslint-disable react/jsx-wrap-multilines */
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Button,
  ConfigProvider,
  Dropdown,
  Menu,
  PageHeader,
} from '@arco-design/web-react';
import { IconLeft } from '@arco-design/web-react/icon';
import { cloneDeep } from 'lodash';
import mjml from 'mjml-browser';
import { saveAs } from 'file-saver';
import services from '@demo/services';
import {
  EmailEditor,
  EmailEditorProvider,
  IEmailTemplate,
  Stack,
} from 'easy-email-editor';
import { IBlockData, JsonToMjml } from 'easy-email-core';
import { SimpleLayout } from 'easy-email-extensions';
import templateJson from '@demo/template.json';
import { setSeo } from '@demo/utils/seo';
import { useHistory } from 'react-router-dom';

import 'easy-email-editor/lib/style.css';
import 'easy-email-extensions/lib/style.css';
import blueTheme from '@arco-themes/react-easy-email-theme/css/arco.css?inline';

import enUS from '@arco-design/web-react/es/locale/en-US';

import { useWindowSize } from 'react-use';

const PRO_URL = 'https://www.easyemail.pro/?utm_source=easy-email-demo&utm_medium=editor-header';
const HEADER_HEIGHT = 60;

export default function Editor() {
  const { width } = useWindowSize();
  const compact = width > 1600;
  const history = useHistory();

  useEffect(() => {
    setSeo({
      title: 'Try Easy Email editor - Drag-and-drop MJML email builder',
      description:
        'Try the Easy Email open-source editor with a fixed MJML template. Build and inspect responsive email content in a React drag-and-drop editor.',
      path: '/editor',
      keywords:
        'try email editor, MJML editor demo, React email builder demo, drag and drop email editor',
    });
  }, []);

  const onUploadImage = async (blob: Blob) => {
    return services.common.uploadByQiniu(blob);
  };

  const initialValues: IEmailTemplate = useMemo(() => {
    const sourceData = JSON.parse(templateJson.content.content) as IBlockData;
    return {
      ...templateJson,
      subject: templateJson.title,
      subTitle: templateJson.summary,
      content: cloneDeep(sourceData),
    };
  }, []);

  const onSubmit = useCallback(
    async (values: IEmailTemplate) => {
      console.log(values);
    },
    [],
  );

  const getMjmlString = useCallback((values: IEmailTemplate) => {
    return JsonToMjml({
      data: values.content,
      mode: 'production',
      context: values.content,
    });
  }, []);

  const onExportMJML = useCallback(
    (values: IEmailTemplate) => {
      const mjmlString = getMjmlString(values);
      navigator.clipboard?.writeText(mjmlString);
      saveAs(new Blob([mjmlString], { type: 'text/mjml' }), 'easy-email.mjml');
    },
    [getMjmlString],
  );

  const onExportHTML = useCallback(
    (values: IEmailTemplate) => {
      const html = mjml(getMjmlString(values), {}).html;
      navigator.clipboard?.writeText(html);
      saveAs(new Blob([html], { type: 'text/html' }), 'easy-email.html');
    },
    [getMjmlString],
  );

  const onExportJSON = useCallback((values: IEmailTemplate) => {
    const json = JSON.stringify(values, null, 2);
    navigator.clipboard?.writeText(json);
    saveAs(new Blob([json], { type: 'application/json' }), 'easy-email.json');
  }, []);

  return (
    <ConfigProvider locale={enUS}>
      <div>
        <style>{blueTheme}</style>
        <EmailEditorProvider
          height={`calc(100vh - ${HEADER_HEIGHT}px)`}
          data={initialValues}
          onUploadImage={onUploadImage}
          onSubmit={onSubmit}
          dashed={false}
          compact={compact}
        >
          {({ values }) => {
            return (
              <>
                <PageHeader
                  style={{
                    height: HEADER_HEIGHT,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    padding: '10px 28px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                  backIcon={
                    <IconLeft
                      style={{
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}
                    />
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                      <span style={{ color: '#fff', fontWeight: 800 }}>Edit</span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 700,
                          opacity: 0.96,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span>🚀 Try Easy Email Pro</span>
                        <span>✅ Cross-browser support</span>
                        <span>✅ React 19 support</span>
                        <span>✅ Desktop &amp; Mobile Email Preview</span>
                        <span>✅ More advanced features</span>
                      </div>
                    </div>
                  }
                  onBack={() => history.push('/')}
                  extra={
                    <Stack alignment='center'>
                      <Dropdown
                        droplist={
                          <Menu>
                            <Menu.Item
                              key='Export MJML'
                              onClick={() => onExportMJML(values)}
                            >
                              Export MJML
                            </Menu.Item>
                            <Menu.Item
                              key='Export HTML'
                              onClick={() => onExportHTML(values)}
                            >
                              Export HTML
                            </Menu.Item>
                            <Menu.Item
                              key='Export JSON'
                              onClick={() => onExportJSON(values)}
                            >
                              Export JSON
                            </Menu.Item>
                          </Menu>
                        }
                      >
                        <Button
                          style={{
                            background: 'rgba(255,255,255,0.2)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 800,
                          }}
                        >
                          Export
                        </Button>
                      </Dropdown>
                      <Button
                        href={PRO_URL}
                        target='_blank'
                        style={{
                          background: '#fff',
                          color: '#667eea',
                          border: 'none',
                          fontWeight: 800,
                        }}
                      >
                        Try Pro Version
                      </Button>
                    </Stack>
                  }
                />
                <SimpleLayout>
                  <EmailEditor />
                </SimpleLayout>
              </>
            );
          }}
        </EmailEditorProvider>
      </div>
    </ConfigProvider>
  );
}
