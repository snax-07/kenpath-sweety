const ENV = {
  get PORT() {
    return process.env.PORT ?? "8080";
  },
  get DATABASE_URL() {
    return process.env.DATABASE_URL as string;
  },
  get JWT_SECRET() {
    return process.env.JWT_SECRET as string;
  },
};

export default ENV;