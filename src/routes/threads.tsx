import {createFileRoute, Link} from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";
import {getThreads} from "../api/conversationApi.ts";

export const Route = createFileRoute('/threads')({
  component: RouteComponent,
})

function RouteComponent() {
 const query = useQuery({
   queryKey: ['threads'],
   queryFn: () => {
     return getThreads()
   }
 })

  if (!query.isSuccess) {
    return <div>Loading...</div>
  }


  return <div className="p-4">
    <h1 className="text-4xl">Threads</h1>

    <div className="mt-5">
      {query.data.map((thread) => (
        <div
          key={thread.id}
          className="bg-nord-dark-1 flex gap-4 p-4 mb-4 bg-nord-polar-night-1 rounded-lg shadow hover:bg-nord-polar-night-2 transition-colors"
        >
          <img
            src={`https://img.youtube.com/vi/${thread.youtube_id}/0.jpg`}
            alt={thread.title}
            className="w-24 h-24 object-cover rounded-md border border-nord-frost-3"
          />
          <div className="flex flex-col justify-between flex-1">
            <Link to={"/threads/" + thread.id}>
              <h2 className="text-xl font-semibold text-nord-frost-1 hover:underline">{thread.title}</h2>
            </Link>
            <p className="text-sm text-nord-frost-3 mt-1">{thread.description}</p>
            <div className="flex flex-col mt-2 space-y-1">
              <p className="text-xs text-nord-frost-4">
                Created at: {new Date(thread.created_at).toLocaleDateString()}
              </p>
              {thread.conversation_date != null && (
                <p className="text-xs text-nord-frost-4">
                  Conversation date: {new Date(thread.conversation_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
}
