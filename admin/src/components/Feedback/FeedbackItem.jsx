export default function FeedbackItem({ feedback }) {
  const bg = feedback.fe_isResolve ? 'bg-blue-200' : 'bg-orange-300'

  return (
    <div className={`p-4 mb-2 rounded ${bg}`}>
      <p className="text-sm text-gray-700">{feedback.feedback_type_name}</p>
      <p className="font-bold">{feedback.fe_content}</p>
      <p className="text-sm text-gray-600">from: {feedback.user_email}</p>
      <p className="text-right text-xs">{feedback.fe_submitedAt} - {feedback.fe_isResolve ? 'responded' : 'not responded yet'}</p>
    </div>
  )
}
