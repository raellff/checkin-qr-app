import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base("42895S736PCRpatvEux3XJsaBjGjX.58db788f5e6741c2fb9ab93ca2264c553e4135387a2f71894c13412e3777a8d2");

export default async function handler(req, res) {
  console.log("Requisição lookup, query:", req.query);

  const { code } = req.query;
  if (!code) {
    console.log("Requisição sem código");
    return res.status(400).json({ error: "Missing code" });
  }

  const records = await base("senderistas")
    .select({
      filterByFormula: `{Codigo} = "${code}"`,
      maxRecords: 1,
    })
    .firstPage();

  if (records.length === 0) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.status(200).json({ recordId: records[0].id });
}
