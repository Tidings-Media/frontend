import { graphql } from "gatsby";
import React, { useEffect, useState } from "react";
import ReactMarkdown, { ReactMarkdownProps } from "react-markdown";
import Author from "../components/Author";
import Layout from "../components/Layout";
import { format } from "date-fns";
import Img, { FluidObject } from "gatsby-image";
import Tag from "../components/Tag";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import BlogCard from "../components/BlogCard";

const Paragraph = ({ children }: { children: string }) => {
  return <p className="md:px-0 px-6 py-4">{children}</p>;
};

const Image = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <img src={src} className="mx-auto medium-zoom" loading="lazy" alt={alt} />
  );
};

const Blog = ({ data }: { data: BlogData }) => {
  const blog = data.strapiBlogs;
  const lastestBlogLost = data.allStrapiBlogs;

  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    setShouldRender(true);
  }, []);

  // Custom Elements for React Markdown
  const customRenderers = {
    paragraph: Paragraph,
    image: Image,
  };
  return (
    <Layout>
      <div className="flex flex-col items-center maindiv">
        <div className="container md:px-20 lg:px-48">
          <div className="pt-10 flex justify-center items-center">
            {/* Gatsby Image */}
            <Img
              fluid={blog.cover.childImageSharp.fluid}
              className="md:w-1/2 w-full h-auto"
              alt="Cover Image"
            />
          </div>
          <div className="flex flex-col justify-center items-center my-10">
            <div
              className="flex justify-start opacity-75 text-sm items-start w-full md:px-0 px-5"
              style={{
                zIndex: -1,
              }}
            >
              {format(Date.parse(blog.published_date), "MMM d, Y")}
            </div>
            <h1 className="md:text-6xl text-5xl mx-6 text-center md:mx-0 my-5 font-heading">
              {blog.title}
            </h1>
          </div>
          <div className="text-lg leading-relaxed font-body">
            <ReactMarkdown
              children={blog.body}
              allowDangerousHtml={true}
              renderers={customRenderers}
            />
          </div>
          <div className="md:px-0 px-6 py-8">
            {/* TAGS */}
            <div className="px-2 md:px-6">
              <h2 className="text-3xl mb-2 font-heading">Tags:</h2>
              {blog.tags && (
                <>
                  {blog.tags.map((tag, i) => {
                    return <Tag tagName={tag.name} />;
                  })}
                </>
              )}
            </div>
            {/* AUTHOR */}
            <Author
              name={blog.author.name}
              // pic={blog.author.pic.formats.small.url}
              pic={blog.author.pic.childImageSharp.fluid}
              about={blog.author.about}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        {!shouldRender ? (
          ""
        ) : (
          <Splide
            options={{
              type: "loop",
              gap: "1rem",
              autoplay: false,
              pauseOnHover: false,
              resetProgress: false,
              arrows: "slider",
              perPage: 3,
              drag: true,
              breakpoints: {
                768: {
                  perPage: 2,
                },
              },
            }}
          >
            {console.log(lastestBlogLost.edges.length)}
            {lastestBlogLost.edges.map(({ node }, i) => {
              return (
                <SplideSlide>
                  <Img fluid={node.cover.childImageSharp.fluid} />
                </SplideSlide>
              );
            })}
          </Splide>
        )}
        {/* TODO: below code gives error */}
      </div>
    </Layout>
  );
};

export default Blog;

export const query = graphql`
  query BlogQuery($slug: String!) {
    strapiBlogs(slug: { eq: $slug }, status: { eq: "published" }) {
      title
      cover {
        childImageSharp {
          fluid {
            aspectRatio
            base64
            src
            srcSet
            sizes
          }
        }
      }
      body
      published_date
      category {
        name
      }
      author {
        name
        about
        pic {
          childImageSharp {
            fluid {
              aspectRatio
              base64
              sizes
              src
              srcSet
            }
          }
        }
      }
      tags {
        name
      }
    }
    allStrapiBlogs(
      limit: 5
      sort: { fields: published_date, order: DESC }
      filter: { status: { eq: "published" } }
    ) {
      edges {
        node {
          body
          slug
          title
          published_date
          category {
            name
          }
          cover {
            childImageSharp {
              fluid {
                aspectRatio
                base64
                sizes
                srcSet
                src
              }
            }
          }
          author {
            name
            pic {
              childImageSharp {
                fluid(maxWidth: 80, maxHeight: 80) {
                  aspectRatio
                  base64
                  sizes
                  src
                  srcSet
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface BlogData {
  strapiBlogs: {
    title: string;
    cover: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
    body: string;
    published_date: string;
    category: {
      name: string;
    };
    author: {
      name: string;
      about: string;
      pic: {
        childImageSharp: {
          fluid: FluidObject;
        };
      };
    };
    tags: {
      name: string;
    }[];
  };
  allStrapiBlogs: {
    edges: {
      node: {
        body: string;
        slug: string;
        title: string;
        published_date: string;
        category: {
          name: string;
        };
        cover: {
          childImageSharp: {
            fluid: FluidObject;
          };
        };
        author: {
          name: string;
          pic: {
            childImageSharp: {
              fluid: FluidObject;
            };
          };
        };
      };
    }[];
  };
}
