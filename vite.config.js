import {defineConfig,loadEnv} from "vite";
import react from '@vitejs/plugin-react'

export default  defineConfig(({command,mode})=>{
console.log(command);
console.log(mode);
const env = loadEnv(mode,process.cwd());
console.log(env);

return {
    plugins: [react()],
    define: {
        "process.env":env
      },
      server:{
        host:"localhost",
        port:3000
      }
}
}
)