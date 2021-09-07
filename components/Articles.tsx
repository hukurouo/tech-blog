import Link from "next/link";

export default function articles({
  allPostsData,
  tag,
}: {
  allPostsData: any;
  tag?: any;
}) {
  return (
    <ul className="">
      {allPostsData.map(({ id, date, title, tags}) => (
        <li className="mb-3" key={id}>
          <Link href={`/articles/${id}`}>
            <a className="text-lg font-semibold text-link-blue ">{title}</a>
          </Link>
          <div className="flex mt-0.5">
            <div className="text-gray-600 text-base pt-tiny">{date} </div>
            
          </div>
          <div className="text-gray-600 text-sm mt-3 mb-8">
            
          </div>
        </li>
      ))}
    </ul>
  );
}
