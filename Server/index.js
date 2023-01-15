import express from "express";
const app = express();
import axios from "axios";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import noncefn from "nonce";
import dotenv from "dotenv";
dotenv.config();

const port = "3000";
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const scopes = process.env.scopes;
const Host = process.env.HOST;

app.use(cookieParser());

app.get("/", (req, res, next) => {
  // res.send("Hello Shopify APP");
  // console.log(apiKey);
  // next();
  const nonce = noncefn()();
  res.cookie("state", nonce);
  console.log(req?.query?.shop);
  console.log(req?.query?.embedded);
  let url = `https://${req?.query?.shop}.myshopify.com/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${Host}/callback&state=${nonce}&grant_options[]=per-user`;
  console.log(url);
  req?.query?.shop && res.redirect(url);
  res.send("Shop not present or Invalid Shop");
});
// app.use((req,res,next)=>{
//     res.send("Hello Shopify APP");
// })
app.get("/callback", async (req, res) => {
  const { state, hmac, code, shop } = req?.query;
  req?.cookies?.state || res.send("State not matched Invalid request spoofing");
  state !== req?.query?.state &&
    res.send("State not matched Invalid request spoofing");

  if (hmac && code && shop) {
    console.log(shop);
    shop.match(/^[a-zA-Z0-9][a-zA-Z0-9\-]*.myshopify.com/) ||
      res.send("Invalid Shop spoofing");
    delete req?.query?.hmac;
    const params = new URLSearchParams(req?.query);
    console.log(params);
    const genertedHash = crypto
      .createHmac("sha256", apiSecret)
      .update(params.toString())
      .digest("hex");
    if (genertedHash == hmac) {
    //   res.send("Auth Code is: " + code);
    let url=`https://${shop}/admin/oauth/access_token`
    let payload={
        client_id:process.env.API_KEY,
        client_secret:process.env.API_SECRET,
        code 
    }
    const response= await axios.post(url,payload);
    console.log(response.data);
    res.send("AUTH TOKEN IS: "+ response.data.access_token);
    }
     else {
      res.send("Hmac not matched attempt for spoofing");
    }
  } 
  
  else {
    res.send("Query Params Missing");
  }

  // res.send("inside callback redirected");
});

app.listen(port, () => {
  console.log("Hello Shopify App server");
});
