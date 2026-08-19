import { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAdminBlogs, deleteBlog } from "../../redux/slices/blogSlice";
import { fetchAdminBlogCategories } from "../../redux/slices/blogCategorySlice";
const Blog = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { adminItems: blogs } = useSelector((state) => state.blog);
  const { adminItems: categories } = useSelector((state) => state.blogCategory);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    dispatch(fetchAdminBlogCategories({ isActive: true }));
    dispatch(fetchAdminBlogs());
  }, [dispatch])
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = !search || b.title?.toLowerCase().includes(search.toLowerCase());
   const matchesCategory =
  !categoryFilter || b.categoryId?._id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteBlog(id));
      toast.success("Blog deleted successfully");
    }
    catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }
  // const categories = [...new Set(blogs.map(b => b.category))];
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Blog Posts</h1>
          <p className="text-sm text-slate-500">Manage blog posts with rich content</p>
        </div>
        <button
          onClick={() => navigate('/admin/blog/new')}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          <FaPlus size={12} />
          New Post
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option
              key={category._id}
              value={category._id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlogs.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="text-sm text-slate-500">No blogs found</p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div key={blog._id} className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition">
              <div className="aspect-video bg-slate-100 relative">
                {blog.coverImage?.url ? (
                  <img src={blog?.coverImage?.url} alt={blog.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <FaImage size={32} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/admin/blog/edit/${blog._id}`)}
                    className="rounded-full bg-white p-2 text-slate-600 shadow hover:text-orange-500"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="rounded-full bg-white p-2 text-slate-600 shadow hover:text-red-500"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                    {blog.categoryId?.name}
                  </span>
                  {blog.featured ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Featured
                    </span>
                  ) : null}
                  {blog.popular ? (
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                      Popular
                    </span>
                  ) : null}
                  {blog.isActive === false ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      Inactive
                    </span>
                  ) : null}
                </div>
                <h3 className="font-semibold text-slate-800 truncate">{blog.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{blog.authorName} . {blog.readingTime} min read</p>
              </div>
            </div>
          ))
        )}
      </div>


    </div>
  );
};

export default Blog;
