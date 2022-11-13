import process from 'node:process'
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'
import { defineUserConfig } from '@vuepress/cli'
import { shikiPlugin } from '@vuepress/plugin-shiki'
import { junkTheme } from 'vuepress-theme-junk'
import { head } from './configs/index.js'

// const __dirname = getDirname(import.meta.url)
const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig({
  // set site base to default value
  base: '/',

  // extra tags in `<head>`
  head,

  // site-level locales config
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Junklog',
      description: 'Just Junklog',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Junklog',
      description: '一些有的没的',
    },
  },

  // specify bundler via environment variable
  bundler:
    process.env.DOCS_BUNDLER === 'webpack' ? webpackBundler() : viteBundler(),

  // specify the pages to be create
  pagePatterns: [
    'content/life/*.md',
    'content/poem/*.md',
    'content/tech/*.md',
    '!.vuepress',
    '!node_modules',
  ],

  // simplify the route path of page
  extendsPage: (page) => {
    if (page.filePathRelative?.startsWith('content')) {
      page.path = page.path.replace('/content', '')
    }
  },

  // configure default theme
  theme: junkTheme({
    logo: '/images/logo.png',
    repo: 'Junkher/vuepress-theme-junk',
    docsDir: 'docs',
    home: '/home/',
    heroContent: `
    I have no ambitions nor desires. <br />
    To be a poet is not my ambition, <br />
    it's simply my way to be alone.
     `,
    heroBtnText: 'FK ME',

    footer: '<p>© 2022-present Junklog - All right reserved</p>',

    personalInfo: {
      name: '雅佚',
      avatar: '/images/avatar.png',
      banner: '/images/banner.jpg',
      bio: 'Tritype-147. 没什么理想的理想主义者:) 不必訝異, 無須歡喜 ',
      sns: {
        github: 'https://github.com/Junkher',
        email: 'mailto:k1344065492@gmail.com',
        telegram: 'https://t.me/junkh_er',
      },
    },
    

    menuGroups: [
      {
        path: '/poem/',
        name: 'POEM',
        weight: 1,
      },
      {
        path: '/life/',
        name: 'LIFE',
        weight: 2,
      },
      {
        path: '/tech/',
        name: 'TECH',
        weight: 3,
      },
    ],

    // theme-level locales config
    locales: {
      /**
       * English locale config
       *
       * As the default locale of @vuepress/theme-default is English,
       * we don't need to set all of the locale fields
       */
      '/': {
        // page meta
        editLinkText: 'Edit this page on GitHub',
      },

      /**
       * Chinese locale config
       */
      '/zh/': {
        // custom containers
        tip: '提示',
        warning: '注意',
        danger: '警告',
        // 404 page
        notFound: [
          '这里什么都没有',
          '我们怎么到这来了？',
          '这是一个 404 页面',
          '看起来我们进入了错误的链接',
        ],
        // a11y
        openInNewWindow: '在新窗口打开',
        toggleColorMode: '切换颜色模式',
        toggleFullscreen: '切换全屏模式',
      },
    },

    themePlugins: {
      // only enable git plugin in production mode
      git: isProd,
      // use shiki plugin in production mode instead
      prismjs: !isProd,
    },
  }),

  // configure markdown
  markdown: {
    headers: {
      level: [1, 2, 3],
    },
    toc: {
      level: [1, 2],
    },
  },

  // use plugins
  plugins: [
    // only enable shiki plugin in production mode
    isProd ? shikiPlugin({ theme: 'dark-plus' }) : [],
  ],
})
