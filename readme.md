# Encode video
Encode lại các video nặng trong cả thư mục.
Giảm dung lượng lưu trữ vẫn đảm bảo chất lượng.

## Requirements
- [node 8.x](https://nodejs.org/en/)
- [ffmpeg](https://www.ffmpeg.org/)

## Deployment
**Install**
- Install [nodejs and npm](https://nodejs.org/en/download/package-manager/)
- Install [ffmpeg](https://www.faqforge.com/linux/how-to-install-ffmpeg-on-ubuntu-14-04/) (ubuntu 14.04), 15.04, 16.04: `apt install -y ffmpeg`
- clone code `git clone https://github.com/mvtcode/encode-video.git`
- `cd encode-video`

**config**
- Edit file `config.js`
- Edit `package.json` (nếu chạy dạng npm)

**Run**
- `dir=/media/tanmv/Videos node app.js`
- Hoặc `npm start`