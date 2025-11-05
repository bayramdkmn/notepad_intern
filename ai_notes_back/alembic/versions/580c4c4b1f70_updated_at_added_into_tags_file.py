"""updated_at added into tags file

Revision ID: 580c4c4b1f70
Revises: 2fc827caa439
Create Date: 2025-11-05 11:06:01.119506

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '580c4c4b1f70'
down_revision: Union[str, Sequence[str], None] = '2fc827caa439'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    pass
