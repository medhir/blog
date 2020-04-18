const axios = require('axios')

/**
 * Blog APIs
 */
const getPosts = () => axios.get('https://medhir.com/api/blog/posts')
const getPost = (slug) => axios.get(`https://medhir.com/api/blog/post/${slug}`)

/**
 * Photos API
 */
const getPhotos = () => axios.get('https://medhir.com/api/photos?album=main')

exports.createPages = async ({ actions: { createPage } }) => {
  /**
   * Blog index page
   */
  const { data: posts } = await getPosts()
  createPage({
    path: '/blog',
    component: require.resolve('./src/templates/blog.js'),
    context: posts,
  })

  /**
   * Blog posts
   */
  const postsArray = posts.posts
  for (let i = 0; i < postsArray.length; i++) {
    const result = await getPost(postsArray[i].titlePath)
    createPage({
      path: `/blog/${postsArray[i].titlePath}`,
      component: require.resolve('./src/templates/blogPost.js'),
      context: result.data,
    })
  }

  /**
   * Photos page
   */
  const { data } = await getPhotos()
  createPage({
    path: '/',
    component: require.resolve('./src/templates/photos.js'),
    context: data,
  })
  createPage({
    path: '/photos',
    component: require.resolve('./src/templates/photos.js'),
    context: data,
  })
}
