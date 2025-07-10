const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
    const total = blogs.reduce((sum, blog) => sum + blog.likes, 0);
    return blogs.length > 0 ? total : 0;
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0]);
}

export {
  dummy,
  totalLikes,
  favoriteBlog
}