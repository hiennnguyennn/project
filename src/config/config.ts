export const configService=()=>({
    db:{
        type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    },
    jwtSecret:process.env.JWT_SECRET,
    port:Number(process.env.PORT)
})