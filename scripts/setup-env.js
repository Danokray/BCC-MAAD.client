const fs = require('fs');
const path = require('path');

const setupEnvironment = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const publicDir = path.join(__dirname, '..', 'public');
  const indexFile = path.join(publicDir, 'index.html');
  const productionIndexFile = path.join(publicDir, 'index.production.html');
  
  if (isProduction) {
    // В production используем строгий CSP
    if (fs.existsSync(productionIndexFile)) {
      fs.copyFileSync(productionIndexFile, indexFile);
      console.log('✅ Production CSP настроен');
    }
  } else {
    // В development используем более мягкий CSP
    console.log('✅ Development CSP активен');
  }
};

setupEnvironment();
