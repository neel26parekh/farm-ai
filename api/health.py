from __future__ import annotations

from http import HTTPStatus

from agro_api import diagnostics
from api._shared import JsonHandler


class handler(JsonHandler):
    def do_GET(self) -> None:
        self.send_json(diagnostics())

    def do_POST(self) -> None:
        self.send_json({"error": "Method not allowed."}, HTTPStatus.METHOD_NOT_ALLOWED)