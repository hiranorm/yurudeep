export const SITE = {
  website: "https://yurudeep.com/",
  author: "ひらノルム",
  profile: "https://github.com/hiranorm",
  desc: "ゆるふわなディープラーニングブログ",
  title: "ゆるディープ",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "ページを編集",
    url: "https://github.com/hiranorm/yurudeep/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "ja",
  timezone: "Asia/Tokyo",
} as const;
