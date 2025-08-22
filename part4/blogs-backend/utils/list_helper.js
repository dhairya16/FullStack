const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (total, blog) => {
    return total + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let maxLikes = 0
  let favBlog = null

  blogs.forEach((blog) => {
    if (blog.likes > maxLikes) {
      favBlog = { ...blog }
      maxLikes = blog.likes
    }
  })

  return favBlog
}

const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return { author: '', blogs: 0 }
  }

  const authorBlogCount = new Map()
  for (const { author } of blogs) {
    authorBlogCount.set(author, (authorBlogCount.get(author) || 0) + 1)
  }

  let maxAuthor = ''
  let maxBlogs = 0
  for (const [author, count] of authorBlogCount.entries()) {
    if (count > maxBlogs) {
      maxAuthor = author
      maxBlogs = count
    }
  }
  return { author: maxAuthor, blogs: maxBlogs }
}

// Returns the author whose blog posts have the largest amount of likes
const mostLikes = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return { author: '', likes: 0 }
  }
  const authorLikes = new Map()
  for (const { author, likes = 0 } of blogs) {
    authorLikes.set(author, (authorLikes.get(author) || 0) + likes)
  }
  let maxAuthor = '',
    maxLikes = 0
  for (const [author, totalLikes] of authorLikes.entries()) {
    if (totalLikes > maxLikes) {
      maxAuthor = author
      maxLikes = totalLikes
    }
  }
  return { author: maxAuthor, likes: maxLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
