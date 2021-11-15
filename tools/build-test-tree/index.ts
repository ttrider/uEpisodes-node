import fs from "fs/promises";
import p from "parse-torrent";
import path from "path";

async function run() {
  console.info("parse torrent files");

  const root = "/Users/vladimiryangurskiy/src/uEpisodes/tools/Torrents";
  const outroot = path.resolve("./", "tree");
  const files = await fs.readdir(root);
  for (const fl of files) {
    const filePath = path.resolve(root, fl);

    const ext = path.extname(filePath);
    if (ext != ".torrent") {
      console.info(filePath, "skipped");
      continue;
    }
    console.info(filePath);

    const tfile = (await fs.readFile(filePath));
    try {
      const t = p(tfile) as p.Instance;
      if (t.files) {
        for (const file of t.files) {
          const fullPath = path.resolve(outroot, file.path);
          const dirPath = path.dirname(fullPath);
          const length = file.length;
          fs.mkdir(dirPath, {recursive:true}).catch(e=>{});
          console.info(" - ", fullPath);
          await fs.writeFile(fullPath, length.toString());
        }
      }
    } catch (e) {
      console.error(e);
    }

  }


}


run().catch(e => console.error(e));


