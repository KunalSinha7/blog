import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts/')

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = getAllFiles([], []);
  const allPostsData = fileNames.map(filePath => {
    // Get file contents
    const fileContents = fs.readFileSync(postsDirectory + filePath.join("/"), 'utf8');
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    // Use file name as id
    filePath[filePath.length-1] = filePath[filePath.length-1].replace(/\.md$/, '');
    // Combine the data with the id
    return {
      "id": filePath,
      ...matterResult.data
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  });
}

export function getAllPostIds() {
  const fileNames = getAllFiles([], []);
  return fileNames.map(filePath => {
    // Use file name as id
    filePath[filePath.length-1] = filePath[filePath.length-1].replace(/\.md$/, '');
    // Combine the data with the id
    return {
      "id": filePath
    }
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id.join("/")}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}

function getAllFiles(currPath, fileNames) {
  fileNames = fileNames || [];
  const currPathStr = Array.prototype.join.call(currPath, "/");
  const paths = fs.readdirSync(postsDirectory + currPathStr);
  paths.forEach((path) => {
    const s = postsDirectory + currPathStr + "/" + path;
    if(fs.statSync(s).isDirectory()) {
      fileNames = getAllFiles([...currPath, path], fileNames);
    } else {
      fileNames.push((currPath ? [...currPath, path] : [path]));
    }
  });
  return fileNames;
}