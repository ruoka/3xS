#include <fstream>
#include "http/server.hpp"

using namespace std;
using namespace string_literals;
constexpr auto eof = static_cast<char>(char_traits<char>::eof());

int main(int argc, char const **argv)
{
    auto server = http::server{};

    auto ifs1 = ifstream{"html/index.html"};
    auto str1 = ""s;
    getline(ifs1, str1, eof);
    server.get("/").response(str1);
    server.get("/index.html").response(str1);

    auto ifs2 = ifstream{"css/u2a.css"};
    auto str2 = ""s;
    getline(ifs2, str2, eof);
    server.get("/u2a.css").response(str2);

    auto ifs3 = ifstream{"js/u2a.js"};
    auto str3 = ""s;
    getline(ifs3, str3, eof);
    server.get("/u2a.js").response(str3);

    server.listen("8080");
    return 0;
}
