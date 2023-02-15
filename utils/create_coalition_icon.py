from PIL import Image
import requests
from cairosvg import svg2png
from io import BytesIO


def create_icon(coa_logo_url, coa_background_color, output):
	result = Image.new('RGB', (512, 512), color = coa_background_color)

	coa_svg = requests.get(coa_logo_url).content
	coa_png = svg2png(bytestring=coa_svg)
	logo = Image.open(BytesIO(coa_png))

	logo = logo.convert('RGBA')
	logo = logo.resize((470, 470))
	result.paste(logo, (21, 21), logo)

	result.save(output)

create_icon('https://cdn.intra.42.fr/coalition/image/47/order.svg', '#FF6950', 'assets/42cursus-paris-the-order.png')