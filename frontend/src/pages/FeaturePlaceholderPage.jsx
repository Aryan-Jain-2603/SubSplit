import EmptyState from "../components/ui/EmptyState";

function FeaturePlaceholderPage({ title, description }) {
  return (
    <div className="py-6">
      <EmptyState title={title} description={description} />
    </div>
  );
}

export default FeaturePlaceholderPage;
