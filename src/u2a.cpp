#include <fstream>
#include "http/server.hpp"

using namespace std;
using namespace string_literals;

auto file(string_view name)
{
    constexpr auto eof = static_cast<char>(char_traits<char>::eof());
    auto file = ifstream{string{name}};
    auto content = ""s;
    getline(file, content, eof);
    return content;
}

int main(int argc, char const **argv)
{
    auto server = http::server{};

    const auto html = file("html/u2a.html");
    server.get("/").response(html);
    server.get("/index.html").response(html);

    const auto css = file("css/u2a.css");
    server.get("/u2a.css").response(css);

    const auto js = file("js/u2a.js");
    server.get("/u2a.js").response(js);

    const auto json = file("json/models.json");
    server.get("/models.json").response(json);

    server.listen("8080");
    return 0;
}
