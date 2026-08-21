import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import BlogGrid from "../components/blog/BlogGrid";
import BlogSidebar from "../components/blog/BlogSidebar";
import FeaturedPost from "../components/blog/FeaturedPost";
import SearchBar from "../components/blog/SearchBar";
import LazyImage from "../components/ui/LazyImage";
import { buildCategoryOptions, mapBlog } from "../utils/blogUtils";
import { fetchBlogs } from "../redux/slices/blogSlice";
import { fetchBlogCategories } from "../redux/slices/blogCategorySlice";

const categoryHeroImages = {
  Adventure:
    "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1600&auto=format&fit=crop",
  Beaches:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
  Mountains:
    "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1600&auto=format&fit=crop",
  Spiritual:
    "https://images.unsplash.com/photo-1598977123418-45205553f40e?q=80&w=1600&auto=format&fit=crop",
  "Travel Tips":
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
};

const categoryDescriptions = {
  Adventure:
    "Thrilling escapes, high-energy routes, and destinations built for adrenaline.",
  Beaches: "Coastal retreats, island escapes, and sun-drenched shorelines.",
  Mountains: "Misty valleys, alpine landscapes, and cool mountain air.",
  Spiritual: "Sacred sites, temple towns, and journeys of inner discovery.",
  "Travel Tips":
    "Smart planning guides, packing lists, and practical travel wisdom.",
};

const INITIAL_VISIBLE = 6;

const BlogCategoryPage = () => {
  const { categorySlug } = useParams();
  const dispatch = useDispatch();
  const { items: blogPosts, loading } = useSelector((state) => state.blog);
  const { items: categories } = useSelector((state) => state.blogCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const mappedPosts = useMemo(() => blogPosts.map(mapBlog), [blogPosts]);

  const categoryOptions = useMemo(
    () => [
      { name: "All", slug: "" },
      ...buildCategoryOptions(categories, mappedPosts),
    ],
    [categories, mappedPosts],
  );

  const activeCategory = useMemo(
    () => categoryOptions.find((category) => category.slug === categorySlug),
    [categoryOptions, categorySlug],
  );
  const categoryName = activeCategory?.name || "";

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchBlogCategories());
  }, [dispatch]);

  const heroImage =
    categoryHeroImages[categoryName] || categoryHeroImages["Travel Tips"];
  const description =
    categoryDescriptions[categoryName] || "Explore stories in this category.";

  const filteredPosts = useMemo(() => {
    if (!categorySlug) return [];
    return mappedPosts.filter((post) => {
      const matchesCategory = post.categorySlug === categorySlug;
      const haystack =
        `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categorySlug, searchTerm, mappedPosts]);

  const featuredPost = useMemo(
    () => filteredPosts.find((post) => post.featured) ?? filteredPosts[0],
    [filteredPosts],
  );

  const visiblePosts = filteredPosts
    .filter((post) => post._id !== featuredPost?._id)
    .slice(0, visibleCount);

  const popularPosts = [...mappedPosts]
    .sort((a, b) => b.dateValue - a.dateValue)
    .slice(0, 4);
  const hasMore =
    filteredPosts.filter((post) => post._id !== featuredPost?._id).length >
    visibleCount;

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-28 text-center sm:px-6">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">
          Loading Stories
        </p>
      </section>
    );
  }

  if (!activeCategory || !categoryName) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-28 text-center sm:px-6">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">
          Category Not Found
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
          This category doesn&apos;t exist.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          The category you&apos;re looking for is not available. Browse all
          stories from the blog.
        </p>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600"
        >
          <FaArrowLeft size={10} />
          Back To Blog
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <LazyImage
            src={heroImage}
            alt={categoryName}
            priority
            wrapperClassName="h-full w-full"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/35" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/70 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:pb-24">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-300 hover:border-orange-300/50 hover:bg-white/15"
          >
            <FaArrowLeft size={10} />
            Back To Blog
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-orange-200">
              {categoryName}
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
              {categoryName} Stories
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base md:text-lg">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/40 to-sky-50/40 py-16 md:py-24">
        <div className="absolute left-0 top-8 h-56 w-56 rounded-full bg-orange-200/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sky-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              {featuredPost ? (
                <div className="mb-8">
                  <p className="text-[11px] font-black uppercase tracking-[0.32em] text-orange-500">
                    Featured Story
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                    Editor&apos;s pick in {categoryName}
                  </h2>
                </div>
              ) : null}

              {featuredPost ? <FeaturedPost post={featuredPost} /> : null}

              <div className="mt-12 space-y-6">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />

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
              activeCategory={categoryName}
              onCategoryChange={() => {}}
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
                  Inspired by these {categoryName.toLowerCase()} stories?
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                  Turn inspiration into an itinerary with curated tours built
                  around your pace, destination style, and travel dates.
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

export default BlogCategoryPage;
