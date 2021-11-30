import fs from "fs/promises";
import p from "parse-torrent";
import path from "path";

async function run() {
  console.info("parse torrent files");

  const root = "/Volumes/exmusic/test-set/Torrents";
  const outroot = path.resolve("/Volumes/exmusic/test-set", "tree");
  const files = await fs.readdir(root);
  for (let index = 0; index < files.length; index++) {
    let fl = files[index];
    if (fl.startsWith("._")){
      fl = fl.substr(2);
    }
    let filePath = path.resolve(root, fl);
   

    const ext = path.extname(filePath);
    if (ext != ".torrent") {
      console.info(`${index}/${files.length}`,filePath, "skipped");
      continue;
    }
    console.info(`${index}/${files.length}`,filePath);

    const tfile = (await fs.readFile(filePath));
    try {
      const t = p(tfile) as p.Instance;
      if (t.files) {
        for (const file of t.files) {
          const fullPath = path.resolve(outroot, file.path);
          const dirPath = path.dirname(fullPath);
          const length = file.length;
          await fs.mkdir(dirPath, {recursive:true}).catch(e=>{});
          console.warn(""," - ", fullPath);
          await fs.writeFile(fullPath, length.toString());
        }
      }
    } catch (e) {
      console.error(e);
    }

  }


}


run().catch(e => console.error(e));


