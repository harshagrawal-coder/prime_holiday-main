import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import BlogGrid from "../components/blog/BlogGrid";
import BlogHeroSection from "../components/blog/BlogHeroSection";
import BlogSidebar from "../components/blog/BlogSidebar";
import FeaturedPost from "../components/blog/FeaturedPost";
import SearchBar from "../components/blog/SearchBar";
import { buildCategoryOptions, mapBlog } from "../utils/blogUtils";
import { fetchBlogs } from "../redux/slices/blogSlice";
import { fetchBlogCategories } from "../redux/slices/blogCategorySlice";

const INITIAL_VISIBLE = 6;
const BlogPage = () => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const { items: blogPosts, loading } = useSelector((state) => state.blog);
  const { items: categories } = useSelector((state) => state.blogCategory);

  const mappedPosts = useMemo(() => blogPosts.map(mapBlog), [blogPosts]);

  const categoryOptions = useMemo(
    () => [{ name: "All", slug: "" }, ...buildCategoryOptions(categories, mappedPosts)],
    [categories, mappedPosts]
  );

  const featuredPost = useMemo(
    () => mappedPosts.find((post) => post.featured) ?? mappedPosts[0],
    [mappedPosts]
  );

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchBlogCategories());
  }, [dispatch]);
  const filteredPosts = useMemo(() => {
    return mappedPosts.filter((post) => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      const haystack = `
${post.title}
${post.excerpt}
${post.category}
`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, mappedPosts]);

  const visiblePosts = filteredPosts
    .filter((post) => post._id !== featuredPost?._id)
    .slice(0, visibleCount);

  const popularPosts = [...mappedPosts]
    .sort((a, b) => b.dateValue - a.dateValue)
    .slice(0, 4);
  const hasMore = filteredPosts.filter((post) => post._id !== featuredPost?._id).length > visibleCount;

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-28 text-center sm:px-6">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">Loading Stories</p>
      </section>
    );
  }

  return (
    <>
      <BlogHeroSection />

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/40 to-sky-50/40 py-16 md:py-24">
        <div className="absolute left-0 top-8 h-56 w-56 rounded-full bg-orange-200/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sky-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="mb-8">
                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-orange-500">
                  Editor&apos;s Pick
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  A magazine-style look at India&apos;s most memorable trips.
                </h2>
              </div>

              <FeaturedPost post={featuredPost} />

              <div className="mt-12 space-y-6">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />

                <div className="flex flex-wrap gap-3">
                  {categoryOptions.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => {
                        setActiveCategory(category.name);
                        setVisibleCount(INITIAL_VISIBLE);
                      }}
                      className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition-all duration-300 ${activeCategory === category.name
                        ? "bg-slate-950 text-white shadow-lg"
                        : "border border-white/60 bg-white/75 text-slate-600 backdrop-blur-md hover:border-orange-200 hover:text-orange-600"
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                <BlogGrid posts={visiblePosts} />

                {hasMore ? (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setVisibleCount((current) => current + 3)}
                      className="rounded-full bg-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-900 shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:text-white"
                    >
                      Load More
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <BlogSidebar
              popularPosts={popularPosts}
              categories={categoryOptions}
              activeCategory={activeCategory}
              onCategoryChange={(category) => {
                setActiveCategory(category);
                setVisibleCount(INITIAL_VISIBLE);
              }}
            />
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 px-6 py-10 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:px-10 md:py-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-orange-300">
                  Ready To Travel
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                  Ready to explore these destinations?
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                  Turn inspiration into an itinerary with curated tours built around your pace,
                  destination style, and travel dates.
                </p>
              </div>

              <Link
                to="/tour"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600"
              >
                View Tours
                <FaArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;
