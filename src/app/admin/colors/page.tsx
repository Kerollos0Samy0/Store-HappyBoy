import fs from 'fs';
import path from 'path';
import ColorsClient from './ColorsClient';

export default async function AdminColorsPage() {
  const mappingPath = path.join(process.cwd(), 'public', 'mapping.json');
  let mapping = {};
  if (fs.existsSync(mappingPath)) {
    mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  }
  
  let dbModels = {};
  try {
    const dbPath = path.join(process.cwd(), '../Stock HappyBoy/models_data.json');
    if (fs.existsSync(dbPath)) {
      dbModels = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    }
  } catch(e) {}

  return <ColorsClient initialMapping={mapping} dbModels={dbModels} />;
}