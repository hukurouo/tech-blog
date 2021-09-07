import Head from "next/head";
import Link from "next/link";
import styles from "./layout.module.css";

const name = "tech.hukurouo.com";
export const siteTitle = "hukurouo";

type typeLayout = {
  children: React.ReactNode;
  home?: boolean;
};

export default function Layout({ children, home }: typeLayout) {
  return (
    <div className={styles.container}>
      <Head>
      </Head>
      <header className="mb-12">
        <h2 className="flex justify-center items-center font-bold text-2xl mt-8 mb-6 mx-5">
          <Link href="/">
            <a className="text-gray-700">{name}</a>
          </Link>
        </h2>
        <div className="flex justify-center">
          <div className="inline-grid grid-flow-col gap-x-4">
            {["diary", "knowledge", "tukutta"].map((tag: string) => {
              return (
                <Link href={`/tag/${tag}`} key={tag}>
                  <a className="text-lg text-gray-700">{tag}</a>
                </Link>
              );
            })}
          </div>
        </div>
      </header>
      <main>{children}</main>
      {!home && (
        <div className="text-blue-500 mt-12 mb-24 lg:text-lg">
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}
