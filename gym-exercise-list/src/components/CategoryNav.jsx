import { categories } from '../data/exercises';

function CategoryNav({ activeCategory, onCategoryChange }) {
  return (
    <div className="category-nav">
      <button
        className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
        onClick={() => onCategoryChange('all')}
      >
        全部动作
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
          onClick={() => onCategoryChange(cat.id)}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryNav;
