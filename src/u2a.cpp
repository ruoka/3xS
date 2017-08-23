#include <fstream>
#include "http/server.hpp"

using namespace std;
using namespace string_literals;
constexpr auto eof = static_cast<char>(char_traits<char>::eof());

int main(int argc, char const **argv)
{
    auto file = ifstream{};
    auto server = http::server{};

    file.open("html/u2a.html");
    auto html = ""s;
    getline(file, html, eof);
    file.close();
    server.get("/").response(html);
    server.get("/index.html").response(html);

    file.open("css/u2a.css");
    auto css = ""s;
    getline(file, css, eof);
    file.close();
    server.get("/u2a.css").response(css);

    file.open("js/u2a.js");
    auto js = ""s;
    getline(file, js, eof);
    file.close();
    server.get("/u2a.js").response(js);

    file.open("json/models.json");
    auto json = ""s;
    getline(file, json, eof);
    file.close();
    server.get("/models.json").response(json);

    server.post("/").response("");

    server.listen("8080");
    return 0;
}
