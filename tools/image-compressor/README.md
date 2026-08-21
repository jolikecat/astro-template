# Image compressor

`input`に配置した画像を圧縮し、ディレクトリ構造を維持したまま`public`へ出力します。`input`は`public`のディレクトリ構造をそのままミラーします。

変換ルールと品質は`config.json`で管理します。

## 使い方

たとえば、次の場所に画像を配置します。

```text
tools/image-compressor/input/assets/images/pages/news/index/hero.jpg
```

プロジェクトルートで圧縮コマンドを実行します。

```sh
pnpm images:compress
```

JPEGとPNGは圧縮した元形式をフォールバックとして残し、同名のWebPも生成します。

```text
public/assets/images/pages/news/index/hero.jpg
public/assets/images/pages/news/index/hero.webp
```

表示時はWebPを優先し、元形式をフォールバックに指定します。

```html
<picture>
	<source srcset="/assets/images/pages/news/index/hero.webp" type="image/webp" />
	<img src="/assets/images/pages/news/index/hero.jpg" width="1200" height="800" alt="" />
</picture>
```

`public`のルートで配信する画像も、同じ対応関係で配置できます。

```text
tools/image-compressor/input/ogp.jpg
├→ public/ogp.jpg  → /ogp.jpg
└→ public/ogp.webp → /ogp.webp
```

## 仕様

- 対応形式はJPEG、PNG、WebP、AVIF、GIF、SVGです。
- JPEGとPNGは、圧縮した元形式とWebPの2ファイルを生成します。`.jpeg`のフォールバックは`.jpeg`のまま出力します。
- ラスター画像はSharpで処理し、品質の初期値は70です。元形式の圧縮後ファイルが入力より大きい場合は、入力ファイルをフォールバックとしてそのまま出力します。
- SVGはSVGOで処理します。
- `photo.jpg`と`photo.png`、または`photo.jpg`と`photo.webp`のように出力先のWebPが重複する入力がある場合は、処理前にエラーで停止します。
- 同名の出力ファイルは上書きします。`public`にだけ存在するファイルや、入力に含まれない既存ファイルは削除しません。
- `input`内の画像は処理後も残りますが、Git管理の対象外です。

## 設定

`config.json`の`quality`でSharpの品質を、`formats`で入力拡張子と出力形式を指定します。`source`は入力と同じ拡張子のフォールバック、`webp`は同名のWebPを表します。

```json
{
	"quality": 70,
	"formats": {
		"jpeg": {
			"extensions": [".jpg", ".jpeg"],
			"outputs": ["source", "webp"]
		},
		"png": {
			"extensions": [".png"],
			"outputs": ["source", "webp"]
		}
	}
}
```

実際の`config.json`にはWebP、AVIF、GIF、SVGとSVGOの設定も含まれています。設定内容はコマンド起動時に検証され、不正な値がある場合は画像を書き込む前に停止します。
