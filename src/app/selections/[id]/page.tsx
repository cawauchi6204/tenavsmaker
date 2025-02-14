import { getSelectionItems, getSelection } from "../../actions";
import Image from "next/image";

export default async function SelectionPage({
  params,
}: {
  params: { id: string };
}) {
  const items = (await getSelectionItems(params.id));
  const selection = (await getSelection(params.id));

  return (
    <main className="container mx-auto pb-8">
      <h1 className="text-2xl font-bold mb-6 text-white">{selection.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.package_id}
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            <div className="aspect-w-16 aspect-h-9">
              <Image
                src={item.image_url}
                alt={item.title}
                className="object-cover w-full h-full"
                width={1000}
                height={1000}
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{item.package_title}</h2>
              <p className="text-gray-600 text-sm mb-2">
                {item.description}
              </p>
              {item.comment && (
                <p className="text-sm italic text-white">{item.comment}</p>
              )}
              <div className="mt-4">
                <a
                  href={item.fanza_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  FANZAで見る →
                </a>
                {item.sample_movie_url && (
                  <a
                    href={item.sample_movie_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  サンプル動画を見る →
                </a>
              )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}