// Configuration for all the sites to check username availability
const sites = [
  {
    name: 'GitHub',
    url: 'https://github.com/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404, // 404 means available, 200 means taken
    invertResult: true,
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    category: 'development'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://abs.twimg.com/favicons/twitter.ico',
    category: 'social'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://www.instagram.com/static/images/ico/favicon.ico',
    category: 'social'
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/tiktok/webapp/main/webapp-desktop/8152caf0c8e8bc67ae0d.png',
    category: 'social'
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://www.youtube.com/s/desktop/favicon.ico',
    category: 'social'
  },
  {
    name: 'Reddit',
    url: 'https://reddit.com/user/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png',
    category: 'social'
  },
  {
    name: 'Discord',
    url: 'https://discord.com/users/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
    category: 'social'
  },
  {
    name: 'Twitch',
    url: 'https://twitch.tv/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png',
    category: 'social'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://static-exp1.licdn.com/sc/h/1bt1uwqhrr3pkbz4i7n8q8q2y',
    category: 'professional'
  },
  {
    name: 'Medium',
    url: 'https://medium.com/@{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://miro.medium.com/v2/resize:fill:32:32/1*sHhtYhaCe2Uc3IU0IgKwIQ.png',
    category: 'content'
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://dev.to/favicon.ico',
    category: 'development'
  },
  {
    name: 'CodePen',
    url: 'https://codepen.io/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://cpwebassets.codepen.io/assets/favicon/favicon-touch-de10acbf5d634ec6791894eba4ba9cf490f709b3d742597c6fc4b734e6492a92.png',
    category: 'development'
  },
  {
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com/users/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
    category: 'development'
  },
  {
    name: 'Behance',
    url: 'https://behance.net/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://a5.behance.net/3c77bd77f77d3d8fd0da883482d4d1a5b8e4195f/img/site/apple-touch-icon.png',
    category: 'creative'
  },
  {
    name: 'Dribbble',
    url: 'https://dribbble.com/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://cdn.dribbble.com/assets/favicon-b3852513460b31b334f15adc38ac12f150a6eb12cdd54a536577315a9a77f709.ico',
    category: 'creative'
  },
  {
    name: 'Pinterest',
    url: 'https://pinterest.com/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://s.pinimg.com/webapp/favicon-54a5b2af.png',
    category: 'social'
  },
  {
    name: 'Snapchat',
    url: 'https://snapchat.com/add/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://static.snapchat.com/global/snapchat.com/favicon.ico',
    category: 'social'
  },
  {
    name: 'Spotify',
    url: 'https://open.spotify.com/user/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://open.scdn.co/cdn/images/favicon.32.png',
    category: 'music'
  },
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com/{username}',
    checkType: 'http',
    method: 'GET',
    expectedStatus: 404,
    invertResult: true,
    logo: 'https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14b.ico',
    category: 'music'
  }
];

module.exports = sites;
