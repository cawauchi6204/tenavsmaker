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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div
            key={item.package_id}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="aspect-w-16 aspect-h-9 relative">
              <Image
                src={item.image_url}
                alt={item.title}
                className="object-cover w-full h-full hover:opacity-90 transition-opacity duration-300"
                width={1000}
                height={1000}
              />
            </div>
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-white mb-3">{item.package_title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {item.description}
              </p>
              {item.comment && (
                <p className="text-pink-400 text-sm italic border-l-4 border-pink-500 pl-3">
                  {item.comment}
                </p>
              )}
              <div className="flex flex-col space-y-3 mt-6">
                <a
                  href={item.fanza_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-center"
                >
                  FANZAで見る →
                </a>
                {item.sample_movie_url && (
                  <a
                    href={item.sample_movie_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors duration-300 text-center"
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