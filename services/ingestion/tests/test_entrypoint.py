import json

from ingestion.__main__ import main


def test_entrypoint(capsys) -> None:
    main()
    output = json.loads(capsys.readouterr().out)
    assert output["status"] == "ok"
    assert output["service"] == "ingestion"
