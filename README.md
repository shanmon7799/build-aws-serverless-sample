
# 環境設置
此專案使用 aws sam 部署以及使用相關 aws service，故得先確保有以下設置

1. 建立 AWS 帳户。
2. 設定 AWS Identity and Access Management(IAM) 權限。
3. 安裝 Docker。請注意：Docker 只是本地測試應用程序的先決條件。
4. 安裝 Homebrew。請注意：自制軟件是僅適用於 Linux 和 macOS 的先決條件。
5. 安裝 AWS SAM命令列界面 (CLI)。請注意：請務必使用 1.13.0 版或更高版本。通過執行sam --version命令。

- [參考 aws sam 文件](https://docs.aws.amazon.com/zh_tw/serverless-application-model/latest/developerguide/what-is-sam.html )

然後在專案目錄下執行以下命令
- `sam build` 打包
- `sam deploy --guided` 部署到 aws 上

接著開啟前端專案，啟動 server 即可開始使用

PS: 如果想在本地端模擬測試，可使用 docker 建立 db
輸入以下指令

1. 建立 db container
- `docker run -p 8000:8000 amazon/dynamodb-local` 

2. 新增一個 table
- `aws dynamodb create-table --table-name SampleTable --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000`

3. 確認有成功新增 table
- `aws dynamodb list-tables --endpoint-url http://localhost:8000`

完成後執行 `sam local start-api` 即可創建一個 docker 環境模擬
