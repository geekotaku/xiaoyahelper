const { readFileSync } = require("fs");
const https = require("https");
const refresh_token = readFileSync('/data/mytoken.txt', 'utf-8').trimEnd();
const parent_file_id = readFileSync('/data/temp_transfer_folder_id.txt', 'utf-8').trimEnd();
const fetch = async (url, headers, body) => {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "POST",
        headers: Object.assign(headers, { "Content-Type": "application/json" }),
      },
      function (res) {
        res.on("data", function (chunk) {
          resolve(JSON.parse(chunk));
        });
      }
    );
    req.write(JSON.stringify(body));
    req.on("error", function (err) {
      reject(err);
    });
    req.end();
  });
};

(async function () {
  try {
    let res = await fetch(
      "https://api.aliyundrive.com/v2/account/token",
      {},
      {
        grant_type: "refresh_token",
        refresh_token,
      }
    );

    if (!res.access_token) {
      throw new Error("未能拿到access_token");
    }

    const headers = {
      Authorization: "Bearer " + res.access_token,
    };

    res = await fetch("https://user.aliyundrive.com/v2/user/get", headers, {});

    if (!res.resource_drive_id) {
      throw new Error("未能拿到资源盘id");
    }

    const drive_id = res.resource_drive_id;

    res = await fetch(
      "https://api.aliyundrive.com/adrive/v2/file/list",
      headers,
      { parent_file_id, drive_id }
    );

    if (!Array.isArray(res.items)) {
      throw new Error("获取文件列表错误");
    } else if (!res.items.length) {
      console.log(
        new Date().toLocaleString() + " " + "文件夹内容为空，执行结束"
      );
      process.exit();
    }

    res = await fetch("https://api.aliyundrive.com/v3/batch", headers, {
      requests: res.items.map((item) => ({
        body: {
          drive_id: item.drive_id,
          file_id: item.file_id,
        },
        headers: {
          "Content-Type": "application/json",
        },
        id: item.file_id,
        method: "POST",
        url: "/file/delete",
      })),
      resource: "file",
    });

    if (!Array.isArray(res.responses)) {
      throw new Error("删除文件失败");
    }

    console.log(
      new Date().toLocaleString() +
        " " +
        "成功删除" +
        res.responses.length +
        "个文件"
    );
  } catch (err) {
    console.error(new Date().toLocaleString() + " " + err.message);
    process.exit();
  }
})();
