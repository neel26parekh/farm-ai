from __future__ import annotations

from http import HTTPStatus

from agro_api import fertilizer_prediction
from api._shared import JsonHandler


class handler(JsonHandler):
    def do_POST(self) -> None:
        try:
            payload = self.parse_json_body()
            self.send_json(fertilizer_prediction(payload))
        except ValueError as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.BAD_REQUEST)
        except Exception as exc:  # pragma: no cover
            self.send_json({"error": f"Prediction failed: {exc}"}, HTTPStatus.INTERNAL_SERVER_ERROR)

    def do_GET(self) -> None:
        self.send_json({"error": "Method not allowed."}, HTTPStatus.METHOD_NOT_ALLOWED)