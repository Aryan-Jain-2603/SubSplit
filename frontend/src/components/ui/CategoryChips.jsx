import Button from "./Button";

function CategoryChips({ categories, activeCategory, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant={!activeCategory ? "secondary" : "ghost"}
        onClick={() => onSelect("")}
      >
        All categories
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "secondary" : "ghost"}
          onClick={() => onSelect(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}

export default CategoryChips;
