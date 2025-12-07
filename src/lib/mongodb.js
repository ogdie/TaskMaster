import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  // Lazy check da variável de ambiente - só verifica quando a função é chamada
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Por favor defina a variável de ambiente MONGODB_URI no .env");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // Configurações Mongoose
    const opts = {
      maxPoolSize: 20,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: "majority",
      journal: true,
      wtimeout: 5000,
      readPreference: "primary",
      compressors: ["snappy", "zlib"],
      bufferCommands: false,
      family: 4,
      autoIndex: false, // Evita criar índices automaticamente
    };

    // Configura strictQuery antes da conexão
    mongoose.set("strictQuery", false);

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("✅ Conectado ao MongoDB com otimizações");

      mongooseInstance.connection.on("error", (err) => {
        console.error("❌ Erro de conexão MongoDB:", err);
      });

      mongooseInstance.connection.on("disconnected", () => {
        console.warn("⚠️ Desconectado do MongoDB");
      });

      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;
