import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setSeo } from '@demo/utils/seo';
import editorHeroImage from '@demo/assets/home/editor-hero.webp';
import proEditorPreviewImage from '@demo/assets/home/pro-editor-preview.webp';
import styles from './index.module.scss';

const PRO_URL = 'https://www.easyemail.pro/';
const DOCS_URL = 'https://www.easyemail.pro/docs';
const GITHUB_URL = 'https://github.com/zalify/easy-email';

const features = [
  ['SDK', 'Self-hosted SDK', 'Embed the editor in your product and keep template data in your own infrastructure.'],
  ['CB', 'Custom blocks', 'Ship reusable product-specific blocks for orders, catalogs, policies, and campaigns.'],
  ['AI', 'AI assistant', 'Rewrite copy, generate assets, and refine layouts without sending editors to another tool.'],
  ['BS', 'Block Studio', 'Compose reusable widget elements visually, then expose only the settings your users need.'],
  ['RP', 'Responsive previews', 'Review desktop and mobile email layouts before customers ever press send.'],
  ['FM', 'File manager', 'Centralize brand assets, uploads, and reusable media for template teams.'],
];

export default function Home() {
  useEffect(() => {
    setSeo({
      title: 'Easy Email - Open-source React email editor with MJML output',
      description:
        'Easy Email is an open-source React email editor for drag-and-drop MJML email building. Try the editor, then upgrade to Easy Email Pro for a self-hosted SDK, custom blocks, AI assistant, responsive previews, and SaaS-ready workflows.',
      keywords:
        'open source email editor, React email editor, MJML email builder, drag and drop email editor, self-hosted email editor SDK, Easy Email Pro',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Easy Email',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        description:
          'Open-source React email editor with drag-and-drop editing and MJML output.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        isRelatedTo: {
          '@type': 'SoftwareApplication',
          name: 'Easy Email Pro',
          url: PRO_URL,
          applicationCategory: 'DeveloperApplication',
        },
      },
    });
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <nav className={styles.nav} aria-label='Primary navigation'>
          <a className={styles.brand} href='/'>
            <span className={styles.brandMark}>E</span>
            <span>
              <strong>Easy Email</strong>
              <small>Open-source editor</small>
            </span>
          </a>

          <div className={styles.navLinks}>
            <a href='#open-source'>Open source</a>
            <a href='#pro'>Pro SDK</a>
            <a href={DOCS_URL} target='_blank' rel='noreferrer'>Docs</a>
            <a href={GITHUB_URL} target='_blank' rel='noreferrer'>GitHub</a>
          </div>

          <div className={styles.navActions}>
            <Link className={styles.secondaryButton} to='/editor'>
              Launch editor
            </Link>
            <a className={styles.primaryButton} href={PRO_URL} target='_blank' rel='noreferrer'>
              Explore Pro
            </a>
          </div>
        </nav>

        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span>Open source</span>
              <span>React</span>
              <span>MJML output</span>
            </div>
            <h1>Own the email editor your SaaS users actually touch.</h1>
            <p className={styles.heroCopy}>
              Easy Email is the open-source React editor for drag-and-drop MJML
              workflows. Explore the core model here, then move to Easy Email Pro
              for a self-hosted SDK, custom blocks, AI assistant, and production
              support.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButtonLarge} to='/editor'>
                Try the open-source editor
              </Link>
              <a className={styles.secondaryButtonLarge} href={PRO_URL} target='_blank' rel='noreferrer'>
                See Easy Email Pro
              </a>
            </div>
            <div className={styles.trustRow} aria-label='Project highlights'>
              <div>
                <strong>MJML</strong>
                <span>Email-safe responsive output</span>
              </div>
              <div>
                <strong>React</strong>
                <span>Composable integration surface</span>
              </div>
              <div>
                <strong>Pro SDK</strong>
                <span>Self-hosted commercial upgrade</span>
              </div>
            </div>
          </div>

          <div className={styles.productStage} aria-label='Easy Email product preview'>
            <div className={styles.productGlow} />
            <figure className={styles.heroScreenshot}>
              <div className={styles.screenshotChrome} aria-hidden='true'>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.screenshotMedia}>
                <img
                  src={editorHeroImage}
                  alt='Easy Email editor interface showing the layout tree, email canvas, and configuration panel'
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section id='open-source' className={styles.pathSection}>
        <div className={styles.sectionIntro}>
          <span>Choose your path</span>
          <h2>Start open-source. Move to Pro when the editor becomes part of your product.</h2>
        </div>
        <div className={styles.pathGrid}>
          <article className={styles.pathCard}>
            <div className={styles.pathHeader}>
              <span>Community</span>
              <strong>Easy Email OSS</strong>
            </div>
            <p>
              A practical React email editor foundation for inspecting block data,
              editing templates, and generating MJML output.
            </p>
            <ul>
              <li>Drag-and-drop email editing</li>
              <li>MJML rendering pipeline</li>
              <li>Open code for exploration</li>
            </ul>
            <Link className={styles.cardAction} to='/editor'>
              Open demo editor
            </Link>
          </article>

          <article className={`${styles.pathCard} ${styles.proCard}`}>
            <div className={styles.pathHeader}>
              <span>Commercial</span>
              <strong>Easy Email Pro</strong>
            </div>
            <p>
              A self-hosted SDK for SaaS teams that need a polished editor,
              commercial features, integration support, and a faster path to market.
            </p>
            <ul>
              <li>Custom blocks and themes</li>
              <li>AI assistant and Block Studio</li>
              <li>Responsive previews and file manager</li>
            </ul>
            <a className={styles.cardAction} href={PRO_URL} target='_blank' rel='noreferrer'>
              Visit Easy Email Pro
            </a>
          </article>
        </div>
      </section>

      <section id='pro' className={styles.featureSection}>
        <div className={styles.sectionIntro}>
          <span>Why Pro exists</span>
          <h2>Open-source gets you started. Pro removes months of product-editor work.</h2>
          <p>
            Easy Email Pro focuses on the features teams usually have to build after
            the first prototype: permissions-friendly UI, reusable blocks, assets,
            personalization, previews, and a commercial support path.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map(([icon, title, copy]) => (
            <article className={styles.featureCard} key={title}>
              <div className={styles.featureIcon} aria-hidden='true'>{icon}</div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>

        <div className={styles.showcaseSection}>
          <article className={styles.showcaseRow}>
            <div className={styles.showcaseCopy}>
              <span className={styles.eyebrow}>Pro editor SDK</span>
              <h3>A production editor surface without months of internal UI work.</h3>
              <p>
                Easy Email Pro turns the open-source editing model into a polished
                embedded SDK: cleaner controls, reusable product blocks, preview
                workflows, and the integration support SaaS teams need.
              </p>
              <ul className={styles.showcaseList}>
                <li>Self-hosted React SDK for your own app</li>
                <li>Custom block workflows for product-specific templates</li>
                <li>Responsive previews and brand-safe editing controls</li>
              </ul>
              <a className={styles.linkAction} href={PRO_URL} target='_blank' rel='noreferrer'>
                Explore Easy Email Pro
              </a>
            </div>
            <figure className={styles.showcaseMedia}>
              <div className={styles.showcaseGlow} />
              <div className={styles.showcaseFrame}>
                <div className={styles.screenshotChrome} aria-hidden='true'>
                  <span />
                  <span />
                  <span />
                </div>
                <img
                  src={proEditorPreviewImage}
                  alt='Easy Email Pro editor preview with block panel, content canvas, and style settings'
                />
              </div>
            </figure>
          </article>
        </div>
      </section>

      <section className={styles.conversionBand}>
        <div>
          <span>Production email editor SDK</span>
          <h2>Building email editing into your SaaS?</h2>
          <p>
            Keep experimenting with the open-source project, or let Easy Email Pro
            carry the production surface: custom blocks, AI workflows, responsive
            preview, localization, and support.
          </p>
        </div>
        <div className={styles.conversionActions}>
          <Link className={styles.secondaryButtonLarge} to='/editor'>
            Try OSS editor
          </Link>
          <a className={styles.primaryButtonLarge} href={PRO_URL} target='_blank' rel='noreferrer'>
            Start with Pro
          </a>
        </div>
      </section>
    </main>
  );
}
