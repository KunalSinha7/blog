import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Input } from "@geist-ui/react";
import { Search } from "@geist-ui/react-icons";

import Layout, { siteTitle } from "../components/layout";
import Date from "../components/date";
import { getSortedPostsData } from "../lib/posts";
import styles from "../components/layout.module.css";
import utilStyles from "../styles/utils.module.css";

export default function Searches({ allPostsData }) {
  const [result, setResult] = useState([]);

  let searchValue = "";

  const onChange = (e) => {
    searchValue = e.target.value;
  };

  const onClick = (e) => {
    setResult(search(searchValue));
  };

  const search = (keyword) => {
    return allPostsData.filter((post) => {
      //Return posts with ids that have keyword in them
      if (post.id.filter((term) => term.includes(keyword)).length > 0) {
        return true;
      }
      //Return posts with titles that have keyword in them
      if(post.title.includes(keyword)) {
        return true;
      }
      //Return posts with tags that have keyword in them
      if (
        post.tags &&
        post.tags.filter((tag) => tag.includes(keyword)).length > 0
      ) {
        return true;
      }
    });
  };

  useEffect(() => {
    console.log("results", result);
  });
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.header}>
        <Input
          placeholder="Search"
          iconRight={<Search />}
          iconClickable={true}
          size="large"
          onIconClick={onClick}
          onChange={onChange}
        />
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Results</h2>
        <ul className={utilStyles.list}>
          {Array.isArray(result) && result.length
            ? result.map(({ id, date, title, tags }, ind) => (
                <li className={utilStyles.listItem} key={ind}>
                  <Link href={`/posts/${id.join("/")}`}>
                    <a>{title}</a>
                  </Link>
                  {tags ? (
                    <div>
                      <small className={utilStyles.lightText}>
                        {tags.length <= 2
                          ? tags.join(", ")
                          : tags.slice(0, 3).join(", ")}
                      </small>
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
              ))
            : allPostsData.map(({ id, date, title, tags }, ind) => (
                <li className={utilStyles.listItem} key={ind}>
                  <Link href={`/posts/${id.join("/")}`}>
                    <a>{title}</a>
                  </Link>
                  {tags ? (
                    <div>
                      <small className={utilStyles.lightText}>
                        {tags.length <= 2
                          ? tags.join(", ")
                          : tags.slice(0, 3).join(", ")}
                      </small>
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
