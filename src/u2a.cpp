#include <fstream>
#include "http/server.hpp"

using namespace std;
using namespace string_literals;

auto file(string_view name)
{
    constexpr auto eof = static_cast<char>(char_traits<char>::eof());
    auto file = ifstream{name.data()};
    auto content = ""s;
    getline(file, content, eof);
    return content;
}

int main([[maybe_unused]]int argc, [[maybe_unused]]char const **argv)
{
    net::slog.redirect(std::clog);

    auto server = http::server{};

    //foo:bar
    //server.credentials({"Basic Zm9vOmJhcg=="});

    const auto model = file("json/model.json");
    server.get("/model.json").json(model);

    const auto view = file("html/view.html");
    server.get("/").html(view);

    const auto controller = file("js/controller.js");
    server.get("/controller.js").script(controller);

    const auto style = file("css/view.css");
    server.get("/view.css").css(style);

    server.listen("8080");
    return 0;
}
