# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'


# build all of the crossing pages
#data.crossing.pages.each do |page|
#  proxy(
#    "crossing/pages/#{page['title']}.html", 
#    "source/templates/crossing_page.html", 
#    locals: {
#      page: page
#    },
#    ignore: true
#  )
#end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript, compressor: Terser.new
# end

activate :livereload

# markdown helper

set :markdown_engine, :kramdown
set :markdown,
  input: 'GFM',
  hard_wrap: false,
  smart_quotes: ["lsquo", "rsquo", "ldquo", "rdquo"]

helpers do
  def md_link(path)
    page = File.read("source/markdown/#{path}")
    Kramdown::Document.new(page).to_html
  end
end
