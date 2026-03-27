import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

function NotFoundPage() {
  return (
    <div className="py-6">
      <EmptyState
        title="Page not found"
        description="The route does not exist in the new React app."
        action={
          <Button asChild>
            <Link to="/plans">Go to plans</Link>
          </Button>
        }
      />
    </div>
  );
}

export default NotFoundPage;
