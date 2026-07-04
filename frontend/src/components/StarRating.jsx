export default function StarRating({ value = 0 }) {
  const rounded = Math.round(value);
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {'★'.repeat(rounded)}{'☆'.repeat(5 - rounded)}
    </span>
  );
}
