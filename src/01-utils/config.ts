class Config {}

class DevelopmentConfig extends Config {
  public isDevelopment = true;
  public connectionString = 'mongodb://localhost:27017/online-store'; // <-- Replace Database with correct name.
}

class ProductionConfig extends Config {
  public isDevelopment = false;
  public connectionString = process.env.MONGO_CONNECTION_STRING;
}

const config = process.env.NODE_ENV === 'production' ? new ProductionConfig() : new DevelopmentConfig();

export default config;
