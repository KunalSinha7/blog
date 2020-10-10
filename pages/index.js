import Head from "next/head";
import Link from "next/link";
import Date from "../components/date";
import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData } from "../lib/posts";
import utilStyles from "../styles/utils.module.css";

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Hi, I'm Kunal. I'm a soccer fan, tech enthusiast, and software
          developer.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title, tags }, ind) => (
            <li className={utilStyles.listItem} key={ind}>
              <Link href={`/posts/${id.join("/")}`}>
                <a>{title}</a>
              </Link>
              {tags ? (
                <div>
                  <small className={utilStyles.lightText}>{tags.length<=3 ? tags.join(', ') : tags.slice(0,3).join(', ') + "..."}</small>
                  
                </div>
              ) : (
                ""
              )}
              <div>
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />
                </small>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
