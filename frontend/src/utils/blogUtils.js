export const formatBlogDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const slugifyCategory = (name = "") =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const mapBlog = (blog = {}) => ({
  _id: blog._id,
  id: blog._id,
  slug: blog.slug,
  title: blog.title,
  excerpt: blog.excerpt,
  image: blog.coverImage?.url || "",
  category: blog.categoryId?.name || blog.categoryName || blog.category || "",
  categorySlug:
    blog.categoryId?.slug ||
    slugifyCategory(
      blog.categoryId?.name || blog.categoryName || blog.category || ""
    ),
  date: formatBlogDate(blog.publishedAt || blog.createdAt),
  dateValue: new Date(blog.publishedAt || blog.createdAt).getTime() || 0,
  readTime: blog.readingTime ? `${blog.readingTime} min read` : "",
  author: blog.authorName || "Prime Holiday Editorial",
  featured: Boolean(blog.featured),
  popular: Boolean(blog.popular),
  highlights: Array.isArray(blog.keyHighlights) ? blog.keyHighlights : [],
  content: Array.isArray(blog.content)
    ? blog.content
    : typeof blog.content === "string"
      ? blog.content
          .split(/\n+/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
      : [],
});

export const buildCategoryOptions = (categories, posts) => {
  if (categories?.length) {
    return categories.map((category) => ({
      name: category.name,
      slug: category.slug,
    }));
  }
  return [
    ...new Set((posts || []).map((post) => post.category).filter(Boolean)),
  ].map((name) => ({ name, slug: slugifyCategory(name) }));
};
