import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";

function EmptyState({ title, description, action }) {
  return (
    <Card className="border-dashed bg-[color:var(--color-surface-subtle)]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action ? <CardContent>{action}</CardContent> : null}
    </Card>
  );
}

export default EmptyState;
