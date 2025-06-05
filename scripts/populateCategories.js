const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/mapData.json', 'utf8'));

function guessCategory(name, notes) {
  const text = (name + ' ' + (notes || '')).toLowerCase();
  if (/pizza|pizzeria|slice/.test(text)) return 'pizza';
  if (/bagel/.test(text)) return 'bagel';
  if (/deli/.test(text)) return 'deli';
  if (/burger/.test(text)) return 'burger';
  if (/cafe|coffee|espresso/.test(text)) return 'cafe';
  if (/ice cream|creamery|frozen|yogurt/.test(text)) return 'dessert';
  if (/bakery|patisserie|bake shop|pastry/.test(text)) return 'bakery';
  if (/bar|saloon/.test(text)) return 'bar';
  if (/chicken/.test(text)) return 'chicken';
  if (/noodle|ramen|udon|pho/.test(text)) return 'noodles';
  if (/sushi|yakitori|omakase|japanese/.test(text)) return 'japanese';
  if (/taco|mexican|quesa|burrito/.test(text)) return 'mexican';
  if (/bbq|barbeque|smoke|grill/.test(text)) return 'bbq';
  if (/indian/.test(text)) return 'indian';
  if (/korean/.test(text)) return 'korean';
  if (/thai/.test(text)) return 'thai';
  if (/vietnam|banh|pho/.test(text)) return 'vietnamese';
  if (/seafood|fish|lobster|crab|oyster/.test(text)) return 'seafood';
  if (/wine/.test(text)) return 'wine';
  return 'other';
}

data.forEach(item => {
  item.category = guessCategory(item.name || '', item.notes || '');
});

fs.writeFileSync('src/mapData.json', JSON.stringify(data, null, 2));
